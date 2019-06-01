#
# MIT License
# copyright (c) Matt Kalal
#
import base64
import sys
import os

FileName = sys.argv[1]
ClickFileName = sys.argv[2]
outFileName = "{}_{}.txt".format(os.path.splitext(FileName)[0],os.path.splitext(FileName)[1].split('.')[1])

#
# encode files to base64
#
with open(FileName,'rb') as filehandle:
    file_b64 = base64.b64encode(filehandle.read())
with open(ClickFileName,'rb') as filehandle:
    clickfile_b64 = base64.b64encode(filehandle.read())

#
# In rudimentary testing, things worked well with less than 3000 lines
#
# So see how many characters long each line will be if we target 2500 lines
# and adjust if/as needed
#

numlines = 2500
linelength = len(clickfile_b64) // numlines

#
# set the maxlines from the larger of the two files
#
if len(clickfile_b64) > len(file_b64):
    maxlines = (len(clickfile_b64) + linelength - 1) // linelength
else:
    maxlines = (len(file_b64) + linelength - 1) // linelength



print('****')
print('Input File: {}'.format(os.path.normpath(FileName)))
print('Output File: {}'.format(os.path.normpath(outFileName)))
print('Encoded File Length: {}'.format(len(file_b64)))
print('Target number of lines: {}'.format(numlines))
print('Length of each line: {}'.format(linelength))



itr = 0

with open(outFileName,'w') as out_handle:
    for itr in range(maxlines):
        linestart = itr*linelength
        fline = file_b64[linestart:linestart + linelength].decode('utf-8')
        cline = clickfile_b64[linestart:linestart + linelength].decode('utf-8')

        if '' == fline:
            fline = '-'
        if '' == cline:
            cline = '-'

        out_handle.write ( "{}|{}{}|{}{}\n".format(os.path.normpath(FileName),("000000" + str(itr))[-6:],fline,("000000" + str(itr))[-6:],cline) )
print("finished")
