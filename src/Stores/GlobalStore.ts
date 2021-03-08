import { observable, action, runInAction, computed, IObservableValue } from "mobx";
import { ProcessValuationDocumentFilter } from "../DtoParams/ProcessValuationDocumentDto";
import { SMXException } from "../SharedEntity/SMXException";

export default class GlobalStore {
    @observable Exception?: SMXException;

    @observable IsLoading?: boolean;

    @observable UpdatedStatusTrigger?: any;

    @observable DSFilterValue?: ProcessValuationDocumentFilter;

    @observable DanhSachTSKhaoSatFilterTrigger?: any;

    @observable ApprovingValuationFilterTrigger?: any;

    @observable HoSoDangDinhGiaFilterTrigger?: any;

    @observable UpdatedStatusTriggerDSAll?: any;

    @observable ProcessValuationDocumentID?: number;

    @observable IsHasNotification?: any;

    @observable UpdateImageTrigger?: any;

    @observable UpdateActField?: any;

    // Bật loading
    @action ShowLoading() {
        this.IsLoading = true;
    }

    // Tắt loading
    @action HideLoading() {
        this.IsLoading = false;
    }

    @action HandleException = (ex?: SMXException) => {
        this.Exception = ex;
    };
}
