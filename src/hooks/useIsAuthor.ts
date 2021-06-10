import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery, usePostQuery } from "../generated/graphql";

export const useIsAuthor = (postId: number) => {
	const [{ data: meData, fetching: fetchingMe }] = useMeQuery();
	const [{ data: postData, fetching: fetchingPost }] = usePostQuery({
		variables: { id: postId },
	});
	const router = useRouter();

	useEffect(() => {
		if (!fetchingMe && !fetchingPost) {
			if (meData?.me.user?.id !== postData?.post?.author.id) {
				router.replace(`/post/${postId}`);
			}
		}
	}, [meData, fetchingMe, postData, fetchingPost, router]);
};
