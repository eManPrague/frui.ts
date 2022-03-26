import RepositoryBase from "./repositoryBase";
import PaymentControllerListQuery from "../entities/paymentControllerListQuery";
import Payment from "../entities/payment";
import PaymentDto from "../entities/paymentDto";

export default class PaymentRepository extends RepositoryBase {
  /** List of payments */
  paymentControllerList(query: PaymentControllerListQuery) {
    return this.callApi(api => api.path(`/api/payments`).getEntity(Payment, query));
    // HTTP 200: Payment
  }

  /** Create payment */
  paymentControllerCreate(payload: PaymentDto) {
    // TODO post /api/payments
    return this.callApi(api => api.path(`/api/payments`).postEntity(payload));
    // HTTP 201: EMPTY
  }

  /** Update payment */
  paymentControllerUpdate(id: number, payload: PaymentDto) {
    // TODO put /api/payments/${id}
    return this.callApi(api => api.path(`/api/payments/${id}`).putEntity(payload));
    // HTTP 200: EMPTY
  }

  /** Destroy payment */
  paymentControllerDelete(id: number) {
    // TODO delete /api/payments/${id}
    return this.callApi(api => api.path(`/api/payments/${id}`).delete());
    // HTTP 200: EMPTY
  }
}
