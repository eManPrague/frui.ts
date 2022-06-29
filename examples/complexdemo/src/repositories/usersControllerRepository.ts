import RepositoryBase from "../data/repositoryBase";
import User from "../entities/user";
import type UserDto from "../entities/userDto";

export default class UsersControllerRepository extends RepositoryBase {
  /** Registration */
  userControllerCreate(payload: UserDto) {
    // TODO post /api/users
    return this.callApi(api => api.path(`/api/users`).postEntity(payload, User));
    // HTTP 201: User
  }
}
