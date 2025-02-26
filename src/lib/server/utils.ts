import { validateEmail } from '$lib/helpers/validators';
import { db } from '$lib/server/db';

export async function addLikedUser(userId: string, likedUser: string) {
  const likedUserId = await getIdByUsername(likedUser);
  const likerUsername = await getUsernameById(userId);
  if (!likedUserId) return false;
  await db`
  UPDATE users
  SET liked_users = ARRAY(
  SELECT DISTINCT unnest(liked_users || ${likedUserId[0].id}::uuid)
  )
  WHERE id = ${userId};
`;
  // console.log("likerUsername", likerUsername[0].username);
  notificator(likedUserId[0].id, likedUser, "like", likerUsername[0].username);
  checkMatch(userId, likedUserId[0].id);
  return true;
}

export async function removeLikedUser(userId: string, likedUser: string) {
  const likerUsername = await getUsernameById(userId);
  const likedUserId = await getIdByUsername(likedUser);
  if (!likedUserId) return false;
  await db`
  UPDATE users
  SET liked_users = ARRAY(
  SELECT DISTINCT unnest(liked_users) EXCEPT SELECT ${likedUserId[0].id}::uuid
  )
  WHERE id = ${userId};
`;
  deleteChat(userId, likedUserId[0].id);
  notificator(likedUserId[0].id, likedUser, "unlike", likerUsername[0].username);
  return;
}

export async function notificator(userId: string, notifiedUser: string, type: string, message: string) {
  const notifiedUserId = await getIdByUsername(notifiedUser);
  if (!notifiedUserId) return false;
  console.log("userId", userId);
  console.log("notifiedUser", notifiedUser)
  await db`
  INSERT INTO notifications (user_id, sender_id, type, message)
  VALUES (${userId}, ${notifiedUserId[0].id}, ${type}, ${message});
  `;
}

export async function checkMatchNoNotification(userId: string, secondUserId: string) {
  const userLikes = await db`SELECT liked_users FROM users WHERE id = ${userId}`;
  const secondUserLikes = await db`SELECT liked_users FROM users WHERE id = ${secondUserId}`;
  // const secondUser = await getUsernameById(secondUserId);
  // const user = await getUsernameById(userId);
  if (userLikes[0].liked_users.includes(secondUserId) && secondUserLikes[0].liked_users.includes(userId)) {
    return true;
  }
  return false;
}

export async function checkMatch(userId: string, secondUserId: string) {
  const userLikes = await db`SELECT liked_users FROM users WHERE id = ${userId}`;
  const secondUserLikes = await db`SELECT liked_users FROM users WHERE id = ${secondUserId}`;
  const secondUser = await getUsernameById(secondUserId);
  const user = await getUsernameById(userId);
  if (userLikes[0].liked_users.includes(secondUserId) && secondUserLikes[0].liked_users.includes(userId)) {
    await db `INSERT INTO chats (user_1, user_2) VALUES (${userId}, ${secondUserId})`;
    notificator(userId, secondUser[0].username, "match", secondUser[0].username);
    notificator(secondUserId, user[0].username, "match", user[0].username);
    return;
  }
  return;
}

export async function getIdByUsername(username: string) {
  const id = await db`SELECT id FROM users WHERE username = ${username}`;
  return id;
}

export async function checkUserLikes(userId: string, likedUser: string) {
  const likedUserId = await getIdByUsername(likedUser);
  if (!likedUserId) return false;
  // const likes = await db`SELECT liked_users FROM users WHERE id = ${userId}`;
  const likes = await db`SELECT unnest(liked_users) AS liked_user FROM users WHERE id = ${userId}`;
  if (likes.length === 0 || likes[0].liked_users === null) {
    return false;
  }
  for (let i = 0; i < likes.length; i++) {
    if (likes[i].liked_user === likedUserId[0].id) {
      return true;
    }
  }
  return false;
}

export async function getAllTags() {
  const tags = await db`SELECT * FROM tags`;
  return tags;
}

export async function getUsernameById(userId: string) {
  const username = await db`SELECT username FROM users WHERE id = ${userId}`;
  return username;
}

export async function deleteChat(userId: string, secondUserId: string) {
  const chat = await db`SELECT * FROM chats WHERE user_1 = ${userId} AND user_2 = ${secondUserId} OR user_1 = ${secondUserId} AND user_2 = ${userId}`;
  if (chat.length === 0) return;
  console.log(chat[0].id);
  await db`DELETE FROM chats WHERE id = ${chat[0].id}`;

}

function userDistanceCalc(currentUser: User, registeredUser: User) {
  if (
    currentUser &&
    currentUser.location &&
    registeredUser &&
    registeredUser.location
  ) {
    const [lat1, lon1] = currentUser.location; // Lat/Lon del usuario actual
    const [lat2, lon2] = registeredUser.location; // Lat/Lon del usuario registrado

    const toRadians = (degrees: number) => (degrees * Math.PI) / 180; // Conversión a radianes

    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = toRadians(lat2 - lat1); // Diferencia de latitudes en radianes
    const dLon = toRadians(lon2 - lon1); // Diferencia de longitudes en radianes

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distancia en kilómetros
    return Math.floor(distance); // Redondear hacia abajo
  }

  return 0; // Si faltan datos
}

export async function userResearch(minAge: number, maxAge: number, minFR: number, maxFR: number, distance: number, tags: number[], currentUser: User) {
  const users = await db`SELECT * FROM users`;
  const usersWithLocation = users.filter(user => user.location && user.username !== currentUser.username);


  const filteredUsers = usersWithLocation.filter(user =>
    user.age >= minAge &&
    user.age <= maxAge &&
    user.total_likes >= minFR &&
    user.total_likes <= maxFR &&
    userDistanceCalc(user.location, currentUser.location) <= distance &&
    tags.every(tag => user.user_preferences.includes(tag))
  );
  return filteredUsers;
}
