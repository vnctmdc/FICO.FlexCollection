import adm_Attachment from "./adm_Attachment";

export default class MortgageAsset {

    public MortgageAssetID?: number;
    public CertNo?: string;
    public LegalState?: number;
    public LegalStateText?: string;
    public Files?: adm_Attachment[];
    public Notes?: string;
}