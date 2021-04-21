enum FunctionCodes {
    VIEW = "VIEW",
    ADD = "ADD",
    EDIT = "EDIT",
    DELETE = "DELETE",
    DISPLAY = "DISPLAY",

    ApproveRejectValuation = "ApproveRejectValuation",

    RequestApproval = "RequestApprove", // Yêu cầu phê duyệt
    Approve = "APPROVE", // Phê duyệt
    Reject = "Reject", // Phê duyệt
    Cancel = "Cancel",
    ApproveByBatch = "ApproveByBatch",
    RequestApproveByBatch = "RequestApproveByBatch",
    ReceiveApprove = "ReceiveApprove",
    ApproveSeftValuation = "ApproveSeftValuation",
    RejectValuation = "RejectValuation",
}

enum RenderPressAgencyDetailType {
    CoCauToChuc = 1,
    LichSuGapMat = 2,
    LichSuThayDoiNhanSu = 3,
    QuanHeGiuaCacCoQuanBT = 4,
    AnhKhac = 5,
    LichSuQuanHe = 6,
}

enum RenderAgencyHRContentType {
    NhanThan = 1,
    LichNhacNho = 2,
}

enum Attitude {
    TichCuc = 1,
    TieuCuc = 2,
    TrungLap = 3,
}

enum NewsStatus {
    MoiTao = 1,
    HoanThanh = 2,
}

// Giới tính
enum Gender {
    Female = 0, // Nữ
    Male = 1, // Nam
    Other = 2, // Khác
}

enum NegativeNews {
    ChuaPhatSinh = 1,
    DaPhatSinh = 2,
}

enum NewStatus {
    MoiTao = 1,
    HoanThanh = 2,
}

enum Classification {
    QuanTrong = 1,
    TrungBinh = 2,
    BinhThuong = 3,
}

enum PositiveType {
    TruyenHinh = 1,
    BaoMang = 2,
    BaoGiay = 3,
    MangXaHoi = 4,
    DienDan = 5,
}

enum NotificationType {
    SinhNhat = 1,
    KyNiem = 2,
    ThanhLap = 3,
    TruyenThong = 4,
}

enum CommentRefType {
    NegativeNews = 1,
    PressAgency = 2,
    News = 3,
    Notification = 4,
    PressAgencyHR = 5,
    NegativeNewsDetail = 6,
}

enum Rate {
    BinhThuong = 1,
    QuanTrong = 2,
}

enum RelationshipWithMB {
    NongAm = 1,
    ThietLap = 2,
    HieuBiet = 3,
    ThanThiet = 4,
}

enum KyHuaTra {
    k1 = 1,
    k2 = 2,
    k3 = 3,
    k4 = 4,
}

enum KetQuaLienHe {
    HuaThanhToan = 67
}

enum PromisePaid {
    ThatHua = 1,
    TraDu = 2,
}

enum AttachmentRefType {
    MortgageAsset = 1,
    ActionField = 2,
    CustomerInfo = 3,
}

enum SourceType {
    Core = 1,
    FlexCollection = 2
}

enum Collection_ActionSchedule {
    Open = 1,
    Implement = 2
}

enum ValidateDocumentReason {
    BoSungHoSo = 1,
    XacMinhQuyHoach = 2,
    XacMinhViTri = 3,
    XacMinhTranhChap = 4,
    KhachHangKhongVayNua = 5,
    LyDoKhac = 6
}

enum MapDocumentRequireStatus {
    Suggest = 0,
    Obligatory = 1,
    Addition = 2
}

enum ProcessValuationDocumentContactType {
    ChualienLacDuoc = 1,
    LienLacDuoc = 2
}

enum ProcessValuationDocument {
    KiemTraHoSo = 1,
    KhaoSatHienTrang = 2,
    LapBaoCaoDinhGia = 4,
    PheDuyetBaoCaoDinhGia = 8,
    HoanThanh = 16,
    YeuCauSuaBaoCaoDinhGia = 32,
    PhatHanhBanCung = 64,
    HuyYeuCau = 128,
    TuChoi = 256,

    // trang thai cho log SLA
    NhapLichHenKhaoSat = 11,
    GiaoCVDG = 12,
    BoSungHoSo = 13,
    DuHoSo = 14,
    DeNghiBoSungHoSo = 15,
    GuiBaoGiaSoBo = 17,
    ChuyenMien = 18,

    // trang thai tim kiem cho Bao cao
    TiepNhanHoSo = 10,
}

enum ValidateDocumentStatus {
    YeuCauBoSungHoSo = 1,
    DaBoSungHoSo = 2,
    DeNghiBoSungHoSo = 3,
}

enum MortgageAssetCode2 {
    // BDS
    BatDongSan_DatO = "BatDongSan_DatO",
    BatDongSan_CaoOc = "BatDongSan_CaoOc",
    BatDongSan_LoDatO = "BatDongSan_LoDatO",
    BatDongSan_ChungCu = "BatDongSan_ChungCu",
    BatDongSan_DuAn = "BatDongSan_DuAn",
    BatDongSan_NhaXuong = "BatDongSan_NhaXuong",
    BatDongSan_NhieuHoNhieuTang = "BatDongSan_NhieuHoNhieuTang",
    BatDongSan_HopThua = "BatDongSan_HopThua", // khong co trong SP, chi tao de redirect folder

    // PTVT
    PTVT_DuongBo = "PTVT_DuongBo",
    PTVT_DuongThuy = "PTVT_DuongThuy",
    PTVT_LoDuongBo = "PTVT_LoDuongBo",

    // MMTB
    MMTB_MMTB = "MMTB_MMTB",
    MMTB_DayChuyen = "MMTB_DayChuyen",

    // TaiSanTuongDuongTien
    TaiSanTuongDuongTien_SoTietKiem = "TaiSanTuongDuongTien_SoTietKiem",

    //So tiet kiem
    GTCG_TTK_STK_HÐTG_CCTG_KyPhieu_HDVKhacCuaTCTD = "GTCG_TTK_STK_HÐTG_CCTG_KyPhieu_HDVKhacCuaTCTD",

    // GTCG
    GTCG_ChungKhoan = "GTCG_ChungKhoan",

    // HangHoa
    HangHoa_HangHoa = "HangHoa_HangHoa",

    // QuyenDoiNo
    QuyenDoiNo_QuyenDoiNo = "QuyenDoiNo_QuyenDoiNo",

    // KimKhiDaQuy
    KimKhiDaQuy_KimKhiDaQuy = "KimKhiDaQuy_KimKhiDaQuy",

    // BaoLanhThanhToan
    BaoLanhThanhToan_BaoLanhThanhToan = "BaoLanhThanhToan_BaoLanhThanhToan",

    // KhoGia
    KhoGia = "KhoGia",
}

enum FeatureId {
    ApprovingValuation = 131001,
    DanhSachTSKhaoSat = 131002,
    HoSoDangDinhGia = 131003,
}

enum ProcessValuationREFrontageType {
    MatDuongPho = 1,
    MatNgoHem = 2,
    MatDuongNoiBo = 3
}
enum TransformerType{
    Nhua = 1,
    BeTong = 2,
    Da = 3,
    Gach = 4,
    Dat = 5,
    Thuy = 6,
}

enum SaveType {
    // Common
    Temporary = 1,
    Completed = 2,

    // Bao cao dinh gia
    PVD_ValidateDoc = 1, // Kiem tra ho so (tab 1)
    PVD_Workfield = 2, // Nhap thong tin tai san (tab 2)
    PVD_Report = 4, // Lap bao cao (tab 3)
}

enum TypeOfConstruction{
    ToanNhaVPTM = 1,
    SanVP = 2,
    KhachSan = 3,
    ToaNhaHonHopVPVaKS = 4,
    ToaNhaHonHopVPVaNO = 5,
    ToaNhaHonHopKSVaNO = 6,
    ToaNHaHonHopTMVaNO = 7,
    Khac = 8,
}

export {
    SaveType,
    FeatureId,
    MortgageAssetCode2,
    ValidateDocumentStatus,
    ProcessValuationDocument,
    ProcessValuationDocumentContactType,
    MapDocumentRequireStatus,
    ValidateDocumentReason,
    Collection_ActionSchedule,
    SourceType,
    KetQuaLienHe,
    Rate,
    CommentRefType,
    Classification,
    NewStatus,
    FunctionCodes,
    Gender,
    Attitude,
    NewsStatus,
    NegativeNews,
    RenderPressAgencyDetailType,
    RenderAgencyHRContentType,
    PositiveType,
    NotificationType,
    RelationshipWithMB,
    AttachmentRefType,
    KyHuaTra,
    PromisePaid,
    ProcessValuationREFrontageType,
    TypeOfConstruction,
    TransformerType,
};
