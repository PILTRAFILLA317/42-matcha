# Matcha
## Registration and Signin
</br>
The app must allow a user to register by requesting at least their email address, username, last name, first name, and a password that is somehow protected. After registration, an email with a unique link must be sent to the registered user to verify their account.</br>
The user must be able to login using their username and password, and also receive an email allowing them to reset their password if they forget it. Additionally, the user must be able to log out with just one click from any page on the site.</br>

## User Profile
</br>
Once a user is connected, they must fill out their profile by providing the following information:</br>
- The gender.
- Sexual preferences.
- A biography.
- A list of interests with tags (e.g. #vegan, #geek, #piercing, etc.), which must be reusable
- Up to 5 pictures, including one to be used as a profile picture.
</br>
At any time, the user must be able to modify this information, as well as their last
name, first name, and email address.</br>
The user must be able to check who has viewed their profile.</br>
As well as who has “liked” them.</br>
The user must have a public “fame rating” 1.</br>
The user must be located using GPS positioning, up to their neighborhood. If the user does not want to be positioned, you must find a way to locate them even without their knowledge.2 The user must be able to modify their GPS position in their profile.</br>

## Browsing
</br>
The user must be able to easily get a list of suggestions that match their profile.</br></br>
You will only propose “interesting” profiles. For example, only men for a hetero- sexual girls. You must manage bisexuality.If the user’s orientation isn’t specified, they will be considered bisexual.</br>
You must cleverly match3 based on:</br>
- Same geographic area as the user.</br>
- A maximum of common tags.</br>
- A maximum “fame rating”.</br>
You must prioritize showing people from the same geographical area.</br>
The list must be sortable by age, location, “fame rating”, and common tags.</br>
The list must be filterable by age, location, “fame rating”, and common tags.</br>

## Research
</br>
The user must be able to conduct an advanced search by selecting one or more criteria, such as:</br>
- An age gap.</br>
- A “fame rating” gap.</br>
- A location.</br>
- One or multiple interest tags.</br>
For the suggested list, the resulting list must be sortable and filterable by age, location, “fame rating” and tags.</br>

## Profiles and other Users
</br>
A user must be able to view the profiles of other users. Profiles must contain all available information about them, except for the email address and password.
When a user views a profile, it must be added to their visit history.
The user must also be able to:</br>
- “Like” another user’s profile picture. When two people “like” each other’s profiles, they will be considered “connected” and can start chatting. If the current user does not have a profile picture, they cannot complete this action.</br>
- You should also remove your “like” to an user whom you had previously “liked”, The user will no longer generate notifications, and you will not be able to chat with them anymore.</br>
- Check the “fame rating” of another user.</br>
- See if a user is currently online, and if not, see the date and time of their last connection.</br>
- Report a user as a “fake account”.</br>
- Block a user. A blocked user will no longer appear in the search results and will not generate additional notifications. And, of course, it will no longer be possible to chat with him.</br>
A user can clearly see if the profile they are viewing is connected or has “like” their profile and must be able to “unlike” or disconnected from that profile.</br>

## Chat
</br>
When two users are connected,4 they must be able to “chat” in real-time.5 The imple- mentation of the chat is up to you. The user must be able to see from any page if a new message is received.
</br>

## Notifications
</br>
A user must be notified in real-time6 of the following events:
</br>
- When the user receives a “like”.</br>
- When the user’s profile has been viewed.</br>
- When the user receives a message.</br>
- When “liked” user also “likes” the user back. • When a connected user “unlikes” the user.</br>