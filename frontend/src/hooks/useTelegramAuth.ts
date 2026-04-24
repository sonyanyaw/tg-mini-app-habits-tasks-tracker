import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateTelegram } from "../services/api";
import { setCredentials } from "../store/slices/authSlice";
import { useAppDispatch } from "../store";
import { isTMA } from "@telegram-apps/bridge";

export const useTelegramAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initAuth = async () => {
      console.log("useTelegramAuth: Starting auth check...");
      // --- Проверяем, запущено ли приложение в Telegram Mini App ---
      if (!isTMA()) {
        console.warn(
          "App is running outside Telegram. Skipping Telegram auth.",
        );
        console.log("tma");
        return;
      } else {
        console.log("App is running inside Telegram.");
      }

      const hash = window.location.hash.slice(1);
      const urlParams = new URLSearchParams(hash);
      const initDataRawFromUrl = urlParams.get("tgWebAppData");
      console.log(
        "useTelegramAuth: Extracted initDataRaw from URL:"
      );

      if (!initDataRawFromUrl) {
        console.error(
          "useTelegramAuth: Failed to extract initDataRaw from URL hash.",
        );
        return;
      }

      try {
        console.log(
          "useTelegramAuth: Sending initDataRaw to backend for authentication...",
        );
        const authPayload = {
          init_data_raw: initDataRawFromUrl,
        };
        console.log(
          "useTelegramAuth: Sending auth payload to backend"
        );
        const response = await authenticateTelegram(authPayload);
        console.log(
          "useTelegramAuth: Authentication successful",
        );

        dispatch(setCredentials(response.data));
        navigate("/tasks");
      } catch (error) {
        console.error("Authentication failed", error);
      }
    };

    initAuth();
  }, [dispatch, navigate]);
};
