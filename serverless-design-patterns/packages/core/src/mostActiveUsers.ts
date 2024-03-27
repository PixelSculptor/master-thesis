import { MovieType, UserType } from '../../types/MovieType';

function userActivity(movieSet: MovieType[]): UserType[] {
    const countActivity = movieSet.reduce((listOfActiveUsers, { userId }) => {
        const foundUser = listOfActiveUsers.find(
            ({ userId: userToCompare }: UserType) => userToCompare === userId,
        );
        if (foundUser) {
            foundUser.numOfReviews++;
        } else {
            listOfActiveUsers.push({ userId, numOfReviews: 1 });
        }
        return listOfActiveUsers;
    }, [] as UserType[]);

    return countActivity;
}

const sortUsersActivity = (
    users: UserType[],
    predicate: (first: UserType, second: UserType) => number,
): UserType[] => {
    return [...users].sort(predicate);
};

const userActivityAscending = (
    firstUser: UserType,
    secondUser: UserType,
): number => firstUser.numOfReviews - secondUser.numOfReviews;
const userActivityDescending = (
    firstUser: UserType,
    secondUser: UserType,
): number => secondUser.numOfReviews - firstUser.numOfReviews;

export function mostActiveUsers(movies: MovieType[]): UserType[] {
    return sortUsersActivity(userActivity(movies), userActivityDescending);
}
