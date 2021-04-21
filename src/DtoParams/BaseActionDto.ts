import ProcessValuation from "../Entities/ProcessValuation";
import ProcessValuationDocument from "../Entities/ProcessValuationDocument";

export default class BaseActionDto {

    public SaveType?: number;

    public ProcessValuationDocumentID?: number;

    public ProcessValuationDocument?: ProcessValuationDocument;

    public ProcessValuation?: ProcessValuation;

}