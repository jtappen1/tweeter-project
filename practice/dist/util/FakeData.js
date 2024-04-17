"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeData = void 0;
const AuthToken_1 = require("../model/domain/AuthToken");
const Status_1 = require("../model/domain/Status");
const User_1 = require("../model/domain/User");
const MALE_IMAGE_URL = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";
const FEMALE_IMAGE_URL = "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png";
class FakeData {
    _authToken = AuthToken_1.AuthToken.Generate();
    get authToken() {
        return this._authToken;
    }
    allUsers = [
        new User_1.User("Allen", "Anderson", "@allen", MALE_IMAGE_URL),
        new User_1.User("Amy", "Ames", "@amy", FEMALE_IMAGE_URL),
        new User_1.User("Bob", "Bobson", "@bob", MALE_IMAGE_URL),
        new User_1.User("Bonnie", "Beatty", "@bonnie", FEMALE_IMAGE_URL),
        new User_1.User("Chris", "Colston", "@chris", MALE_IMAGE_URL),
        new User_1.User("Cindy", "Coats", "@cindy", FEMALE_IMAGE_URL),
        new User_1.User("Dan", "Donaldson", "@dan", MALE_IMAGE_URL),
        new User_1.User("Dee", "Dempsey", "@dee", FEMALE_IMAGE_URL),
        new User_1.User("Elliott", "Enderson", "@elliott", MALE_IMAGE_URL),
        new User_1.User("Elizabeth", "Engle", "@elizabeth", FEMALE_IMAGE_URL),
        new User_1.User("Frank", "Frandson", "@frank", MALE_IMAGE_URL),
        new User_1.User("Fran", "Franklin", "@fran", FEMALE_IMAGE_URL),
        new User_1.User("Gary", "Gilbert", "@gary", MALE_IMAGE_URL),
        new User_1.User("Giovanna", "Giles", "@giovanna", FEMALE_IMAGE_URL),
        new User_1.User("Henry", "Henderson", "@henry", MALE_IMAGE_URL),
        new User_1.User("Helen", "Hopwell", "@helen", FEMALE_IMAGE_URL),
        new User_1.User("Igor", "Isaacson", "@igor", MALE_IMAGE_URL),
        new User_1.User("Isabel", "Isaacson", "@isabel", FEMALE_IMAGE_URL),
        new User_1.User("Justin", "Jones", "@justin", MALE_IMAGE_URL),
        new User_1.User("Jill", "Johnson", "@jill", FEMALE_IMAGE_URL),
        new User_1.User("Kent", "Knudson", "@kent", MALE_IMAGE_URL),
        new User_1.User("Kathy", "Kunzler", "@kathy", FEMALE_IMAGE_URL),
    ];
    // Allows mocking of fake users
    get fakeUsers() {
        return this.allUsers;
    }
    allStatuses = [];
    // Allows mocking of fake statuses
    get fakeStatuses() {
        return this.allStatuses;
    }
    // Used to force statuses to be re-generated if test cases use
    // different sets of fake users (by mocking the fakeUsers method).
    fakeUsersUsedToGenerateStatuses = [];
    static _instance;
    /**
     * Returns the singleton instance.
     */
    static get instance() {
        if (FakeData._instance == null) {
            FakeData._instance = new FakeData();
        }
        return this._instance;
    }
    constructor() {
        // eslint-disable-next-line no-self-compare
        if (this.fakeUsers !== this.fakeUsers) {
            // Verify that this.fakeUsers always returns the same list of users (this could be violated by mock implementations of fakeUsers)
            throw new Error("fakeUsers should return the same list of fake users each time it's called");
        }
        if (this.fakeUsers !== this.fakeUsersUsedToGenerateStatuses) {
            this.generateFakeStatuses();
        }
        // eslint-disable-next-line no-self-compare
        if (this.fakeStatuses !== this.fakeStatuses) {
            // Verify that this.fakeStatuses always returns the same list of users (this could be violated by mock implementations of fakeStatuses)
            throw new Error("fakeStatuses should return the same list of fake statuses each time it's called");
        }
    }
    /**
     * Generates fake statuses for the fake users.
     */
    generateFakeStatuses() {
        this.allStatuses = [];
        let timestampStart = 0;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.fakeUsers.length; j++) {
                let sender = this.fakeUsers[j];
                let mention = j < this.fakeUsers.length - 1
                    ? this.fakeUsers[j + 1]
                    : this.fakeUsers[0];
                let post = `Post ${i} ${j}
        My friend ${mention.alias} likes this website: http://byu.edu. Do you? 
        Or do you prefer this one: http://cs.byu.edu?`;
                let timestamp = timestampStart + 30000000000 * (i * this.fakeUsers.length + j);
                let status = new Status_1.Status(post, sender, timestamp);
                this.allStatuses.push(status);
            }
        }
        this.fakeUsersUsedToGenerateStatuses = this.fakeUsers;
    }
    /**
     * Returns the first fake user, or null if there are no fake users.
     */
    get firstUser() {
        return this.fakeUsers.length > 0 ? this.fakeUsers[0] : null;
    }
    /**
     * Returns the second fake user, or null if there are not at least two fake users.
     */
    get secondUser() {
        return this.fakeUsers.length > 1 ? this.fakeUsers[1] : null;
    }
    /**
     * Finds the user with the specified alias.
     *
     * @param alias the alias of the user to be returned.
     * @returns the user or null if no user is found with the specified alias.
     */
    findUserByAlias(alias) {
        for (let user of this.fakeUsers) {
            if (user.alias === alias) {
                return user;
            }
        }
        return null;
    }
    /**
     * Returns a random boolean for whether or not a user follows another user.
     */
    isFollower() {
        return Math.floor(Math.random() * 2) === 0;
    }
    /**
     * Returns a page of users (followers or followees).
     *
     * @param lastUser the last user returned in the previous page of results.
     * @param limit maximum number of users to return (i.e., page size).
     * @param omit if not null, specifies a user that should not be returned.
     * @returns a tuple containing a page of users and a "hasMorePages" flag.
     */
    getPageOfUsers(lastUser, limit, omit) {
        let userIndex = 0;
        // Find the index of the first user to be returned
        if (lastUser != null) {
            for (let i = 0; i < this.fakeUsers.length; i++) {
                if (this.fakeUsers[i].equals(lastUser)) {
                    userIndex = i + 1;
                    break;
                }
            }
        }
        let fakeUsersToReturn = [];
        let count = 0;
        while (userIndex < this.fakeUsers.length && count < limit) {
            let currentUser = this.fakeUsers[userIndex];
            if (omit == null || currentUser.alias !== omit.alias) {
                fakeUsersToReturn.push(currentUser);
                count++;
            }
            userIndex++;
        }
        return [fakeUsersToReturn, userIndex < this.fakeUsers.length];
    }
    /**
     * Returns a page of statuses (story or feed items).
     *
     * @param lastStatus - the last status returned in the previous page of results.
     * @param limit - maximum number of statuses to return (i.e., page size).
     * @returns a tuple containing a page of statuses and a "hasMorePages" flag.
     */
    getPageOfStatuses(lastStatus, limit) {
        let statusIndex = 0;
        // Find the index of the first status to be returned
        if (lastStatus != null) {
            for (let i = 0; i < this.fakeStatuses.length; i++) {
                let currentStatus = this.fakeStatuses[i];
                if (currentStatus.equals(lastStatus)) {
                    statusIndex = i + 1;
                    break;
                }
            }
        }
        let fakeStatusesToReturn = [];
        for (let count = 0; statusIndex < this.fakeStatuses.length && count < limit; count++, statusIndex++) {
            fakeStatusesToReturn.push(this.fakeStatuses[statusIndex]);
        }
        return [fakeStatusesToReturn, statusIndex < this.fakeStatuses.length];
    }
    /**
     * Returns a followers count for the user. Always returns 20 for male users and 21 for female users.
     */
    getFollowersCount(user) {
        return user.imageUrl === FEMALE_IMAGE_URL ? 21 : 20;
    }
    /**
     * Returns a followees count for the user. Always returns 10 for male users and 11 for female users.
     */
    getFolloweesCount(user) {
        return user.imageUrl === FEMALE_IMAGE_URL ? 11 : 10;
    }
}
exports.FakeData = FakeData;
