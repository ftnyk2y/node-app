//時刻表示を整形するための関数
function toDoubleDigitString(num) {
        return ('0' + num).slice(-2); 
}

//時刻文字列
function makeTimeString(time) {
        return toDoubleDigitString(time.getFullYear()) + '/' + toDoubleDigitString( time.getMonth() + 1 ) + '/' + toDoubleDigitString( time.getDate() )
               + ' ' + toDoubleDigitString( time.getHours() ) + ':' + toDoubleDigitString( time.getMinutes() ) + ' ' + toDoubleDigitString( time.getSeconds() );
}

exports.toDoubleDigitString = toDoubleDigitString;
exports.makeTimeString = makeTimeString;
