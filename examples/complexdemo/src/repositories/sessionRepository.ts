import RepositoryBase from "../data/repositoryBase";
import SessionDto from "../entities/sessionDto";
import User from "../entities/user";

export default class SessionRepository extends RepositoryBase {
  /** Login user */
  sessionControllerLogin(payload: SessionDto) {
    // TODO post /api/session
    return this.callApi(api => api.path(`/api/session`).postEntity(payload, User));
    // HTTP 201: User
  }

  /** Current user */
  sessionControllerCurrent() {
    return this.callApi(api => api.path(`/api/session`).getEntity(User));
    // HTTP 200: User
  }

  /** Logout user */
  sessionControllerLogout() {
    // TODO delete /api/session
    return this.callApi(api => api.path(`/api/session`).delete());
    // HTTP 200: User
  }
}
