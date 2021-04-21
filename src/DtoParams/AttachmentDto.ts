import adm_Attachment from "../Entities/adm_Attachment";
import ProcessValuationDocument from "../Entities/ProcessValuationDocument";
import ProcessValuationEquipment from "../Entities/ProcessValuationEquipment";
import ProcessValuationRE from "../Entities/ProcessValuationRE";
import SystemParameter from "../Entities/SystemParameter";

export default class AttachmentDto {
    public AttachmentID?: number;
    public Attachment?: adm_Attachment;
    public Attachments?: adm_Attachment[];
    public RefID?: number;
    public RefType?: number;
    public RefCode?: string;
    public CustomerID?: number;

    public LstHoSoECM?: adm_Attachment[];
    public LstAttachment?: adm_Attachment[];
    public LstAttType?: SystemParameter[];
    public ListWorkfieldImage?: adm_Attachment[];

    public MACode2?: string;
    public ProcessValuationDocumentID?: number;
    public MortgageAssetID?: number;

    public MortgageAssetProductionLineDetailID?: number;
    public ProcessValuationEquipmentID?: number;
    public ProcessValuationEquipment?: ProcessValuationEquipment;
    public ProcessValuationRE?: ProcessValuationRE;
    public ProcessValuationDocument?: ProcessValuationDocument;
    public IsHasSoDoQuyHoach?:boolean;
    public IsHasSoDoVeTinh?: boolean;
    public AttachmentSoDoVeTinh?: adm_Attachment;
    public AttachmentSoDoQuyHoach?: adm_Attachment;

}
