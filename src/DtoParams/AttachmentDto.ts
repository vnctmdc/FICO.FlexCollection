import adm_Attachment from "../Entities/adm_Attachment";
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
}
