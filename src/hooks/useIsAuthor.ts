import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery, usePostQuery } from "../generated/graphql";
import { useGetIsAuthor } from "./useGetIsAuthor";

export const useIsAuthor = (postId: number) => {
	const isAuthor = useGetIsAuthor(postId);
	const router = useRouter();

	useEffect(() => {
		if (!isAuthor) {
            router.replace(`/post/${postId}`);
        }
	}, [isAuthor, router]);
};
