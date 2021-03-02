import moment from 'moment';

export default class Utility {
    static CheckPermission(functionCodes: Array<string>, features: Array<string>): boolean {
        if (functionCodes) {
            const result = functionCodes.some((x) => features.includes(x));
            return result;
        } else return false;
    }

    static GetFirstCharacter(name: string) {
        var names = name.split(" ");
        return names[names.length - 1].charAt(0);
    }

    static GetRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    static GetAge(dateVal: Date): string {
        if (dateVal && dateVal != null) {
            dateVal = new Date(dateVal);

            let year = dateVal.getFullYear();
            let currentYear = new Date().getFullYear();

            return (currentYear - year).toString();
        } else return "";
    }

    static ConvertToDateTimeToRequest(val: Date) {
        if (val) {
            let val1 = new Date(val);
            let hoursDiff = val1.getHours() - val1.getTimezoneOffset() / 60;
            let minuteDiff = (val1.getHours() - val1.getTimezoneOffset()) % 60;
            val1.setHours(hoursDiff);
            val1.setMinutes(minuteDiff);
            return val1;
        }
        return null;
    }

     static ConvertToUtcDateTime(valStr: any): Date {
         if (valStr && valStr !== "") {
             let val = new Date(valStr);
             let hoursDiff = val.getHours() - val.getTimezoneOffset() / 60;
             let minuteDiff = (val.getHours() - val.getTimezoneOffset()) % 60;
             val.setHours(hoursDiff);
             val.setMinutes(minuteDiff);
             return val;
         }
         return null;
     }

    // static ConvertToUtcDateTime(date: any): any {
    //     //todo Hiep fix chenh múi giờ post lêm
    //     if (date) {
    //         var dateNow = new Date();
    //         let gmt = 0;
    //         gmt = (dateNow.getTimezoneOffset() / 60)  -1;//số phút chênh chia 60 ra dc số giờ lệch (-7h so với múi +0 nên  -1)
    //         let val = new Date(date.getFullYear(), date.getMonth(), date.getDate(), dateNow.getHours() + gmt, dateNow.getMinutes(), dateNow.getSeconds());
    //         return moment(val).utc().format();
    //     }
    //     return null;
    // }

    // Trả ra date string với format DD/MM/YYYY
    static GetDateString(dateVal: Date): string {
        if (dateVal !== null && dateVal !== undefined) {
            dateVal = new Date(dateVal);

            let year = dateVal.getFullYear().toString();

            let month = (dateVal.getMonth() + 1).toString();
            if (month.length < 2) {
                month = "0" + month;
            }

            let day = dateVal.getDate().toString();
            if (day.length < 2) {
                day = "0" + day;
            }

            return day + "/" + month + "/" + year;
        } else {
            return "";
        }
    }

    // Trả ra date string với format DD/MM/YYYY
    static GetMonthString(dateVal: Date): string {
        if (dateVal !== null && dateVal !== undefined) {
            dateVal = new Date(dateVal);

            let year = dateVal.getFullYear().toString();

            let month = (dateVal.getMonth() + 1).toString();
            if (month.length < 2) {
                month = "0" + month;
            }

            return month + "/" + year;
        } else {
            return "";
        }
    }

    //Trả ra Kỳ trả nợ dạng string
    static GetKyTraNo(value: number): String {
        if (value !== null && value !== undefined) {
            if(value.toString.length == 1)
                return value.toString();
            return "0" + value.toString();
        } else {
            return "";
        }
    }

    //Trả ra Mã màu
    static GetColorCode(value: string): String {
        if (value !== null && value !== undefined) {
            if (value == 'B4') {
                return "#02c39a";
            } else if (value == 'B3') {
                return "#fb5607";
            } else if (value == 'B2') {
                return "#028090";
            } else if (value == 'B1') {
                return "#3a86ff";
            } else if (value == 'B0') {
                return "#8338ec";
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    // Trả ra DateString với format hh:mm DD/MM/YYYY
    static GetDateMinuteString(dateVal: Date): string {
        if (dateVal !== null && dateVal !== undefined) {
            dateVal = new Date(dateVal);
            let offset = dateVal.getTimezoneOffset() / 60;
            dateVal.setHours(dateVal.getHours() + offset);

            let year = dateVal.getFullYear().toString();

            let month = (dateVal.getMonth() + 1).toString();
            if (month.length < 2) {
                month = "0" + month;
            }

            let day = dateVal.getDate().toString();
            if (day.length < 2) {
                day = "0" + day;
            }

            let hour = dateVal.getHours().toString();

            if (hour.length < 2) {
                hour = "0" + hour;
            }

            let minute = dateVal.getMinutes().toString();

            if (minute.length < 2) {
                minute = "0" + minute;
            }

            return hour + ":" + minute + " - " + day + "/" + month + "/" + year;
        } else {
            return "";
        }
    }

    // Chuyển đổi 1 string sang date và hiển thị giá trị date đó với format DD/MM/YYYY
    static ParseAndGetDateString(dateString: string): string {
        if (dateString !== null && dateString !== undefined) {
            try {
                var dte = new Date(dateString);

                return Utility.GetDateString(dte);
            } catch {
                return "";
            }
        } else {
            return "";
        }
    }

    // Chuyển đổi 1 string sang date và hiển thị giá trị date đó với format hh:mm DD/MM/YYYY
    static ParseAndGetDateMinuteString(dateString: string) {
        if (dateString !== null && dateString !== undefined) {
            try {
                var dte = new Date(dateString);

                return Utility.GetDateMinuteString(dte);
            } catch {
                return "";
            }
        } else {
            return "";
        }
    }

    // Hiển thị giá trị decimal
    static GetDecimalString(num: number): string {
        if (num !== null && num !== undefined) {
            var num_parts = num.toString().split(".");
            num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return num_parts.join(".");
        } else {
            return "";
        }
    }

    // Cast 1 string sang Date
    static ConvertToDate(dateString: string): Date | null {
        if (dateString !== null && dateString !== undefined) {
            try {
                var dte = new Date(dateString);
                return dte;
            } catch {
                return null;
            }
        } else {
            return null;
        }
    }

    // Cast 1 string sang NullableInt
    static ConvertToInt(intString: string): number | null {
        if (intString !== null && intString !== undefined) {
            try {
                var result = parseInt(intString);
                return result;
            } catch {
                return null;
            }
        } else {
            return null;
        }
    }

    // Cast 1 string sang NullableDecimal
    static ConvertToDecimal(decString: string): number | null {
        if (decString !== null && decString !== undefined) {
            try {
                var result = parseFloat(decString);
                return result;
            } catch {
                return null;
            }
        } else {
            return null;
        }
    }

    static GetDictionaryValue<T>(dict: iKeyValuePair<T, string>[], key: T): string {
        // console.log(key);
        // console.log(dict);
        if (key !== undefined && key !== null) {
            let item = dict.find((en) => en.Key === key);
            //console.log(item);
            if (item) {
                return item.Value;
            }
        } else {
            return "";
        }
    }

    // Xóa dấu tiếng Việt
    static FormatVNLanguage(str: string): string {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        // str = str.replace(/\W+/g, ' ');
        // str = str.replace(/\s/g, '-');
        return str;
    }
}
