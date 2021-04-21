import adm_Attachment from "../Entities/adm_Attachment";
import ProcessValuation from "../Entities/ProcessValuation";
import ProcessValuationDocument from "../Entities/ProcessValuationDocument";
import ProcessValuationDocumentContact from "../Entities/ProcessValuationDocumentContact";
import ProcessValuationEquipment from "../Entities/ProcessValuationEquipment";
import SystemParameter from "../Entities/SystemParameter";
import { BaseParam } from "./BaseParam";

export default class ProcessValuationDto extends BaseParam {

    public ProcessValuationDocumentID?: number;

    public ProcessValuationEquipmentID?: number;

    public ProcessValuationDocument?: ProcessValuationDocument;
    
    public ProcessValuation?: ProcessValuation;

    public ListMortgageAssetCode2?: SystemParameter[];

    public ListMortgageAssetLevel2?: SystemParameter[];

    public ListAttachmentMortgageAsset?: adm_Attachment[];

    public ListProcessValuationDocumentContact?: ProcessValuationDocumentContact[];

    //
    public MACode2?: string;
    
    public ProcessValuationEquipment?: ProcessValuationEquipment;

    public ProcessValuationDocumentContact?: ProcessValuationDocumentContact;

    public MACode2Enable?: boolean;
    
}