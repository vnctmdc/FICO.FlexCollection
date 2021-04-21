import adm_Attachment from "../Entities/adm_Attachment";
import ProcessValuation from "../Entities/ProcessValuation";
import ProcessValuationDocument from "../Entities/ProcessValuationDocument";
import ProcessValuationRE from "../Entities/ProcessValuationRE";

export default class RECondominiumDto {

    public SaveType?: number;

    public ProcessValuationDocument?: ProcessValuationDocument;

    public ProcessValuation?: ProcessValuation;

    public ProcessValuationDocumentID?: number;
    
    public LstAttachment?: adm_Attachment[];

    public Attachment?: adm_Attachment;

    public ProcessValuationRE?: ProcessValuationRE;
    
}