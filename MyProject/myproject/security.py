from myproject.services import UserAccountService

def groupfinder(userid, request):

    pipeline_pos= userid.find("|")
    email = userid[:pipeline_pos]
    nick = userid[pipeline_pos+1:]
    found_acc = UserAccountService.account_by_email_nick(email, nick)
    if found_acc == None:
        return []
    else:
        return [email, nick]

