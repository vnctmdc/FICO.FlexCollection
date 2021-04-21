import MortgageAsset from "../Entities/MortgageAsset";
import ProcessValuationRE from "../Entities/ProcessValuationRE";
import SystemParameter from "../Entities/SystemParameter";
import BaseActionDto from "./BaseActionDto";

export default class BatchREDto extends BaseActionDto {
  public ProcessValuationRE?: ProcessValuationRE;

  public LstMortgageAsset?: MortgageAsset[];

  public LstContiguousStreetType?: SystemParameter[];

  public MortgageAssetID?: number;
}
