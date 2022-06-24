import RepositoryBase from "../data/repositoryBase";
import EnumerationResponseDto from "../entities/enumerationResponseDto";

export default class EnumerationsRepository extends RepositoryBase {
  /** Enumerations */
  categoryControllerEnums() {
    return this.callApi(api => api.path(`/api/enums`).getEntity(EnumerationResponseDto));
    // HTTP 200: EnumerationResponseDto
  }
}
