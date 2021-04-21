import adm_Attachment from "../Entities/adm_Attachment";
import MortgageAssetProductionLineDetail from "../Entities/MortgageAssetProductionLineDetail";
import ProcessValuationEquipment from "../Entities/ProcessValuationEquipment";
import BaseActionDto from "./BaseActionDto";

export default class BatchEquipmentDto extends BaseActionDto {
  public ProcessValuationEquipment?: ProcessValuationEquipment;

  public MortgageAssetProductionLineDetail?: MortgageAssetProductionLineDetail;

  public ProcessValuationEquipmentID?: number;

  public ListWorkfieldImage?: adm_Attachment[];
  
  public MortgageAssetProductionLineDetailID?: number;
}
