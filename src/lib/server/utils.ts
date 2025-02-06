import { validateEmail } from '$lib/helpers/validators';
import { db } from '$lib/server/db';

export async function getAllTags() {
    const tags = await db`SELECT * FROM tags`;
    return tags;
}

export async function getUsernameById(userId: number) {
    const username = await db`SELECT username FROM users WHERE id = ${userId}`;
    return username;
}

function userDistanceCalc(currentUser, registeredUser) {
    if (
      currentUser &&
      currentUser.location &&
      registeredUser &&
      registeredUser.location
    ) {
      const [lat1, lon1] = currentUser.location; // Lat/Lon del usuario actual
      const [lat2, lon2] = registeredUser.location; // Lat/Lon del usuario registrado

      const toRadians = (degrees) => (degrees * Math.PI) / 180; // Conversión a radianes

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

export async function visitUserPage(currentUser: User, visitedUser: User) {
    const visit = await db`INSERT INTO visits (visitor, visited) VALUES (${currentUser.userId}, ${visitedUser.userId})`;
    return visit;
}