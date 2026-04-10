<?php
// הגדרת זמן ישראל
date_default_timezone_set('Asia/Jerusalem');

$logFile = 'log.txt';
$userIP = $_SERVER['REMOTE_ADDR'];
$currentTime = date("H:i:s d/m/Y");

// בדיקה אם המשתמש הוא "מנהל" (אתה) לפי עוגייה
$isAdmin = isset($_COOKIE['admin_user']) && $_COOKIE['admin_user'] === 'true';

// מחיקת יומן (רק למנהל)
if (isset($_GET['clear']) && $isAdmin) {
    file_put_contents($logFile, "");
    header("Location: mc.php");
    exit;
}

// רישום כניסה - רק אם זה לא מנהל
if (!$isAdmin) {
    if (isset($_GET['heartbeat'])) {
        // עדכון "דופק" - מוסיף רק נקודה או סימן שהיא עדיין שם כדי לא להעמיס שורות
        $entry = " -- עדיין צופה ב: $currentTime\n";
        file_put_contents($logFile, $entry, FILE_APPEND);
        exit;
    } else {
        // כניסה חדשה ונקייה
        $entry = "\n[כניסה חדשה] | שעה: $currentTime | IP: $userIP\n";
        file_put_contents($logFile, $entry, FILE_APPEND);
    }
}

$logContent = file_exists($logFile) ? file_get_contents($logFile) : "אין כניסות של אחרים";
?>

<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>משהו בשבילך</title>
    <style>
        body { background: #000; color: #fff; text-align: center; font-family: sans-serif; margin: 0; padding-top: 50px; }
        h1 { cursor: pointer; user-select: none; -webkit-user-select: none; padding: 20px; font-size: 20px; }
        video { width: 95%; max-width: 500px; border-radius: 10px; }
        #secret-log { display: none; background: #fff; color: #000; text-align: left; padding: 20px; margin: 20px auto; width: 90%; border-radius: 10px; font-family: monospace; white-space: pre-wrap; }
        .btn-clear { background: red; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; margin-top: 10px; }
    </style>
</head>
<body oncontextmenu="return false;">

    <h1 id="secret-trigger">נזכרתי בזה וחשבתי עלייך...</h1>
    
    <video id="myVideo" controls autoplay playsinline>
        <source src="mc.mp4" type="video/mp4">
    </video>

    <div id="secret-log">
        <div style="background: #D4EDDA; padding: 10px; margin-bottom: 10px; border-radius: 5px; font-weight: bold; text-align: center;">
            מצב מנהל פעיל: המערכת מתעלמת מהכניסות שלך.
        </div>
        <h3>יומן כניסות (אחרים):</h3>
        <div id="log-data" style="font-size: 13px;"><?php echo $logContent; ?></div>
        <button class="btn-clear" onclick="if(confirm('למחוק את כל ההיסטוריה?')) location.href='?clear=1'">נקה הכל</button>
    </div>

    <script>
        // שליחת עדכון פעילות כל 20 שניות (כדי לדעת כמה זמן היא נשארה)
        setInterval(function() {
            fetch('mc.php?heartbeat=1');
        }, 20000);

        let timer;
        const trigger = document.getElementById('secret-trigger');
        const logDiv = document.getElementById('secret-log');

        function startTimer(e) {
            timer = setTimeout(() => {
                // הגדרת עוגייה ל-365 יום כדי שהשרת יזהה אותך תמיד
                document.cookie = "admin_user=true; max-age=" + (60*60*24*365) + "; path=/";
                
                logDiv.style.display = 'block';
                logDiv.scrollIntoView({behavior: "smooth"});
                alert("מצב מנהל הופעל. מהרגע הזה המערכת לא תרשום אותך יותר.");
            }, 10000); // 10 שניות לחיצה
        }

        function cancelTimer() { clearTimeout(timer); }

        trigger.addEventListener('touchstart', startTimer, {passive: false});
        trigger.addEventListener('touchend', cancelTimer);
        trigger.addEventListener('mousedown', startTimer);
        trigger.addEventListener('mouseup', cancelTimer);
    </script>
</body>
</html>

