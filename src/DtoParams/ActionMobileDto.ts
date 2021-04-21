import adm_Attachment from "../Entities/adm_Attachment";
import ProcessValuation from "../Entities/ProcessValuation";
import ProcessValuationDocument from "../Entities/ProcessValuationDocument";
import ProcessValuationDocumentContact from "../Entities/ProcessValuationDocumentContact";
import ProcessValuationRE from "../Entities/ProcessValuationRE";
import ProcessValuationREApartment from "../Entities/ProcessValuationREApartment";
import ProcessValuationREConstruction from "../Entities/ProcessValuationREConstruction";
import ProcessValuationVehicle from "../Entities/ProcessValuationVehicle";


import SystemParameter from "../Entities/SystemParameter";
import { BaseParam } from "./BaseParam";

export default class ActionMobileDto extends BaseParam {

    public ProcessValuationDocumentID?: number;
    public ProcessValuationDocument?: ProcessValuationDocument;
    public ProcessValuation?: ProcessValuation;
    public MACode2?: string;
    public ProcessValuationRE?: ProcessValuationRE;
    public ProcessValuationREApartment?: ProcessValuationREApartment;
    public ProcessValuationREConstruction?: ProcessValuationREConstruction;
    public LstContiguousStreetType?: SystemParameter[];
    public SaveType? : number;
    public LstBuildingType ?: SystemParameter[];
    public LstConstructionType ?: SystemParameter[];
    public ListProcessValuationREConstruction?: ProcessValuationREConstruction[];
    public ProcessValuationVehicle?: ProcessValuationVehicle;
    public LstCarType ?: SystemParameter[];
    public LstUsePurpose ?: SystemParameter[]; 
    public ListProcessValuationREApartment? : ProcessValuationREApartment[];
}