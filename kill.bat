@echo off

taskkill/F /IM openfin.exe
taskkill /IM node.exe /F

del /q "%localappdata%\OpenFin\cache\*"
FOR /D %%p IN ("%localappdata%\OpenFin\cache\*.*") DO rmdir "%%p" /s /q

del /q "%localappdata%\OpenFin\apps\*"
FOR /D %%p IN ("%localappdata%\OpenFin\apps\*.*") DO rmdir "%%p" /s /q

del /q "%localappdata%\OpenFin\runtime\*"
FOR /D %%p IN ("%localappdata%\OpenFin\runtime\*.*") DO rmdir "%%p" /s /q

del /q "%localappdata%\OpenFin\logs\*"
FOR /D %%p IN ("%localappdata%\OpenFin\logs\*.*") DO rmdir "%%p" /s /q

del /q "%localappdata%\OpenFin\cache.dat"

del /q "%localappdata%\OpenFin\OpenFinRVM.exe"
