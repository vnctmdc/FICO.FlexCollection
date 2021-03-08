import adm_Attachment from "../Entities/adm_Attachment";
import ProcessValuation from "../Entities/ProcessValuation";
import ProcessValuationDocument from "../Entities/ProcessValuationDocument";
import ProcessValuationDocumentContact from "../Entities/ProcessValuationDocumentContact";
import ProcessValuationRE from "../Entities/ProcessValuationRE";
import ProcessValuationREApartment from "../Entities/ProcessValuationREApartment";
import ProcessValuationREConstruction from "../Entities/ProcessValuationREConstruction";

import SystemParameter from "../Entities/SystemParameter";
import { BaseParam } from "./BaseParam";

export default class ActionDto extends BaseParam {

    public ProcessValuationDocumentID?: number;
    public ProcessValuationDocument?: ProcessValuationDocument;
    public ProcessValuation?: ProcessValuation;
    public MACode2?: string;
    public ProcessValuationRE?: ProcessValuationRE;
    public ProcessValuationREApartment?: ProcessValuationREApartment;
    public ProcessValuationREConstruction?: ProcessValuationREConstruction;
    
}