from datetime import datetime

class TimeUtils:
    def timestamp():
        return int(round(datetime.now().timestamp() * 1000))