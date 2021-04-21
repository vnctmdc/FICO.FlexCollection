import ProcessValuation from "../Entities/ProcessValuation";
import ProcessValuationDocument from "../Entities/ProcessValuationDocument";
import ProcessValuationVehicle from "../Entities/ProcessValuationVehicle";
import SystemParameter from "../Entities/SystemParameter";
import BaseActionDto from "./BaseActionDto";

export default class VehicleRoadDto extends BaseActionDto {

    public LstUsePurpose?: SystemParameter[];
    
    public LstCarType?: SystemParameter[];

    public ProcessValuationVehicle?: ProcessValuationVehicle;


}