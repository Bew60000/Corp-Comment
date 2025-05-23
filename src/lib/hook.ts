import { useContext, useEffect, useState } from "react";
import { FeedbackItemsContext } from "../context/FeedbackItemsContextProvider";
import { TFeedbackItem } from "./types";

export function useFeedbackItemContext() {
  const context = useContext(FeedbackItemsContext);
  if (!context) {
    throw new Error(
      "FeedbackItemsContext is not define in FeedbackList component"
    );
  }

  return context;
}


export function useFeedbackItems () {
  const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFeedbackItems = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
        );

        if (!response.ok) {
          throw new Error();
        }

        const data = await response.json();
        setFeedbackItems(data.feedbacks);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setErrorMessage("Something went wrong. Please try again later.");
      }

      setIsLoading(false);
    };

    fetchFeedbackItems();
  }, []);

  return {
    feedbackItems,
    isLoading,
    errorMessage,
    setFeedbackItems,

  }
} 