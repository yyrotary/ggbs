import { google } from "googleapis";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: ".env.local" });

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

async function testConnection() {
    console.log("--- Google Sheets 연결 테스트 시작 ---");

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const keyContent = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

    if (!sheetId || !keyContent) {
        console.error("오류: .env.local 파일에 셜정값이 비어있습니다.");
        process.exit(1);
    }

    try {
        const credentials = JSON.parse(keyContent);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: SCOPES,
        });

        const authClient = await auth.getClient();
        const sheets = google.sheets({ version: "v4", auth: authClient as any });

        const response = await sheets.spreadsheets.get({
            spreadsheetId: sheetId,
        });

        console.log(`성공: 스프레드시트 "${response.data.properties?.title}"에 연결되었습니다!`);

        // Check for "Sheet1"
        const sheetExists = response.data.sheets?.some(s => s.properties?.title === "Sheet1");
        if (!sheetExists) {
            console.warn("경고: 'Sheet1' 탭을 찾을 수 없습니다. 기본 탭 이름이 'Sheet1'인지 확인해주세요.");
        } else {
            console.log("확인: 'Sheet1' 탭이 존재합니다.");
        }

    } catch (error: any) {
        console.error("연결 실패:", error.message);
        if (error.message.includes("not found")) {
            console.error("팁: 스프레드시트 ID가 올바른지 확인하세요.");
        } else if (error.message.includes("permission denied")) {
            console.error("팁: 서비스 계정 이메일을 시트에 '편집자'로 공유하셨나요?");
        }
    }
}

testConnection();
