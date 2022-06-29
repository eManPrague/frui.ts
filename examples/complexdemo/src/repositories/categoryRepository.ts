import RepositoryBase from "../data/repositoryBase";
import Category from "../entities/category";
import type CategoryControllerListQuery from "../entities/categoryControllerListQuery";
import type CategoryDto from "../entities/categoryDto";

export default class CategoryRepository extends RepositoryBase {
  /** List of categories */
  categoryControllerList(query: CategoryControllerListQuery) {
    return this.callApi(api => api.path(`/api/categories`).getEntity(Category, query));
    // HTTP 200: Category
  }

  /** Create category */
  categoryControllerCreate(payload: CategoryDto) {
    // TODO post /api/categories
    return this.callApi(api => api.path(`/api/categories`).postEntity(payload));
    // HTTP 201: EMPTY
  }
}
