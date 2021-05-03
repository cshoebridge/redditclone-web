import { UpdootDirection } from "../generated/graphql";

export const directionToNumber = (direction: UpdootDirection): number => {
    if (direction === UpdootDirection.Up) {
        return 1;
    }
    else if (direction === UpdootDirection.Down) {
        return -1;
    }
    return 0;
}