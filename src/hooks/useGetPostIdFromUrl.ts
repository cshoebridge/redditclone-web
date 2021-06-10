import { useRouter } from "next/router";
import { usePostQuery } from "../generated/graphql";

export const useGetPostIdFromUrl = () => {
	const router = useRouter();
	const postId = router.query.postid;
	const intId = typeof postId === "string" ? parseInt(postId) : -1;
    return intId;
};
