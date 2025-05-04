import { create } from "zustand";
import { TFeedbackItem } from "../lib/types";

type Store = {
    feedbackItems: TFeedbackItem[];
    isLoading: boolean;
    errorMessage: string;
    selectCompany: string;
    getCompanyList: () => string[];
    getFilteredFeedbackItems: () => TFeedbackItem[];
    addItemToList: (text: string) => Promise<void>;
    selectedCompany: (company: string) => void;
    fetchFeedbackItems: () => Promise<void>;
  };

export const useFeedbackItemsStore = create<Store>((set, get) => ({
    feedbackItems: [],
    isLoading: false,
    errorMessage: "",
    selectCompany: "",
    getCompanyList: () => {
        return get().feedbackItems.map((item) => item.company)
            .filter((company, index, array) => {
                return array.indexOf(company) === index;
            });
    },
    getFilteredFeedbackItems: () => {
        const state = get();

        return state.selectCompany
            ? state.feedbackItems.filter(
                (feedbackItem) => feedbackItem.company === state.selectCompany
            )
            : state.feedbackItems;
    },
    addItemToList: async (text: string) => {
        const companyName = text
            .split(" ")
            .find((word) => word.includes("#"))!
            .substring(1);

        const newItem: TFeedbackItem = {
            id: new Date().getTime(),
            text: text,
            upvoteCount: 0,
            daysAgo: 0,
            company: companyName,
            badgeLetter: companyName.substring(0, 1).toUpperCase(),
        };
        // setFeedbackItems([...feedbackItems, newItem]);
        set(state => ({
            feedbackItems: [...state.feedbackItems, newItem]
        }));

        await fetch(
            "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
            {
                method: "POST",
                body: JSON.stringify(newItem),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );
    },
    selectedCompany: (company: string) => {
        // setSelectCompany(company);
        set(() => ({
            selectCompany: company
        }));
    },
    fetchFeedbackItems: async () => {
        // setIsLoading(true);
        set(() => ({
            isLoading: true,
        }))

        try {
            const response = await fetch(
                "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
            );

            if (!response.ok) {
                throw new Error();
            }

            const data = await response.json();
            set(() => ({
                feedbackItems: data.feedbacks,
            }))
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            set(() => ({
                errorMessage: "Something went wrong.Please try again later.",
            }))
        }

        set(() => ({
            isLoading: false,
        }))
    },
}));