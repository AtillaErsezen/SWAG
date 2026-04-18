@echo off
echo "enter 1: SWAG -> Desktop"
echo "enter 2: Desktop -> SWAG"
set /p choice="Enter your choice:"
if /i %choice% == 1 goto SWAG_TO_DESKTOP
if /i %choice% == 2 goto DESKTOP_TO_SWAG
echo invalid choice
pause
exit

:SWAG_TO_DESKTOP
echo Verifying .env file exists...
if exist C:\Users\ersez\Desktop\.env (
    echo Another .env file found in Desktop. Rename to make sure it doesn't overwrite the content.
    pause
    exit
)
if exist C:\Users\ersez\SWAG\.env (
    echo .env file found.
) else (
    echo C:\Users\ersez\SWAG\.env file not found.
)
echo Moving file to Desktop...
move C:\Users\ersez\SWAG\.env C:\Users\ersez\Desktop\ 
echo .env file moved to Desktop.
if exist C:\Users\ersez\Desktop\.env (
    echo file confirmed successfully
)else(
    echo file not found in C:\Users\ersez\Desktop\.env
)
REM press any key to continue text, to be able to see echo outputs in window before exit

:DESKTOP_TO_SWAG
echo Verifying the file exists...
if exist C:\Users\ersez\Desktop\.env (
    echo .env file found.
) else (
    echo C:\Users\ersez\Desktop\.env file not found.
)
REM didn't add any file check in project folder, you probably won't have another .env file
echo Moving file to Desktop...
move C:\Users\ersez\Desktop\.env C:\Users\ersez\SWAG\ 
echo File moved.
if exist C:\Users\ersez\SWAG\.env (
    echo File moved successfully.
) else(
    echo Moving file failed.
)


pause
exit
