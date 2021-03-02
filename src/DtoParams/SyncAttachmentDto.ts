import adm_Attachment from "../Entities/adm_Attachment";
import Collection_DocumentAction from "../Entities/Collection_DocumentAction";
import PromiseToPay from "../Entities/PromiseToPay";


export default class SyncAttachmentDto {

    public DocAction?: Collection_DocumentAction;

    public PromiseToPay?: PromiseToPay;

    public DocumentActionFieldID?: number;

    public LstAttachment?: adm_Attachment[];

}