import { IPost } from "./Post";
import { Persistence } from "../persistence/Persistence";

class PostPersistence extends Persistence<IPost[]> {
  
}

export { PostPersistence }