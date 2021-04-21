import ProcessValuationVessel from "../Entities/ProcessValuationVessel";
import SystemParameter from "../Entities/SystemParameter";
import BaseActionDto from "./BaseActionDto";

export default class VesselDto extends BaseActionDto {

    public ProcessValuationVessel?: ProcessValuationVessel;

}