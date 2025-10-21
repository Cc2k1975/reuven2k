// מציג כפתור התקנה גדול באמצע המסך.
// הכפתור מופיע פעם אחת בכל כניסה (עד רענון/סגירה) – sessionStorage.

let deferredPrompt = null;
const ua = navigator.userAgent || "";
const isIOS = /iPhone|iPad|iPod/i.test(ua);

// לא להציק שוב באותו ביקור
if (!sessionStorage.getItem("pwaPromptShown")) {
  // ניצור כפתור מראש, כדי שתמיד נראה אותו (גם אם beforeinstallprompt לא יורה – למשל ב-iOS)
  const btn = document.createElement("button");
  btn.id = "pwaInstallBtn";
  btn.type = "button";
  btn.textContent = "הוסף למסך הבית";
  Object.assign(btn.style, {
    position: "fixed",
    inset: "50% auto auto 50%",
    transform: "translate(-50%,-50%)",
    width: "150px",
    height: "150px",
    borderRadius: "9999px",
    background: "#e53935",      // עיגול אדום
    color: "#fff",
    fontWeight: "800",
    fontSize: "16px",
    lineHeight: "1.2",
    textAlign: "center",
    padding: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,.45)",
    zIndex: "99999",
    border: "0",
    cursor: "pointer"
  });

  // טקסט קטן מתחת (עוזר למקרה של iOS)
  const hint = document.createElement("div");
  hint.id = "pwaInstallHint";
  hint.textContent = "לחיצה תתקין (או תציג הוראות)";
  Object.assign(hint.style, {
    position: "fixed",
    left: "50%",
    top: "calc(50% + 110px)",
    transform: "translateX(-50%)",
    color: "#ffd700",
    fontSize: "14px",
    fontFamily: "Arial,Helvetica,sans-serif",
    zIndex: "99999",
    textAlign: "center",
    pointerEvents: "none"
  });

  document.body.appendChild(btn);
  document.body.appendChild(hint);

  // נשמור שסימנו – שלא יצוץ שוב עד רענון
  sessionStorage.setItem("pwaPromptShown", "1");

  // נתפוס את beforeinstallprompt (באנדרואיד/כרום)
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  // התנהגות בעת לחיצה
  btn.addEventListener("click", async () => {
    // אם יש event אמיתי – נציג את חלון ההתקנה
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        // אחרי הדיאלוג – לא נשמור יותר את ה-event
        deferredPrompt = null;
      } catch (_) {}
    } else {
      // אין תמיכה (לרוב iOS): נציג הסבר קצר
      alert(
        "ב-iPhone: לחצי על כפתור השיתוף (הריבוע עם החץ) ואז 'הוספה למסך הבית'."
      );
    }

    // נסיר את הכפתור אחרי לחיצה
    try { btn.remove(); hint.remove(); } catch(_) {}
  });

  // הותקן בפועל – נסיר את הכפתור אם עדיין קיים
  window.addEventListener("appinstalled", () => {
    try { btn.remove(); hint.remove(); } catch(_) {}
  });

  // ליתר ביטחון – אם הכפתור מפריע, נאפשר להעלים אותו בלחיצה ארוכה (3 שניות)
  let holdTimer = null;
  btn.addEventListener("mousedown", () => {
    holdTimer = setTimeout(() => {
      try { btn.remove(); hint.remove(); } catch(_) {}
    }, 3000);
  });
  ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach(ev =>
    btn.addEventListener(ev, () => clearTimeout(holdTimer))
  );
}
