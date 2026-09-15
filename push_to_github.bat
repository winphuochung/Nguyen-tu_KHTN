@echo off
chcp 65001 > nul
echo ========================================================
echo   DANG DAY MA NGUON LEN GITHUB (NGUYEN-TU_KHTN)
echo ========================================================
echo.
echo Cua so trinh duyet co the xuat hien de yeu cau ban dang nhap GitHub.
echo Vui long bam 'Sign in with your browser' / 'Authorize' neu duoc hoi.
echo.

set "GIT_EXE=C:\Users\ADMIN\AppData\Local\MinGit\cmd\git.exe"

"%GIT_EXE%" push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo [THANH CONG] Toan bo ma nguon da duoc dua len GitHub thanh cong!
    echo Link du an: https://github.com/winphuochung/Nguyen-tu_KHTN
) else (
    echo [CHU Y] Vui long kiem tra lai ket noi hoac xac thuc tai khoan tren trinh duyet.
)
echo.
pause
