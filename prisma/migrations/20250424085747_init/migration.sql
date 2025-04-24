-- CreateTable
CREATE TABLE "User" (
    "userID" INTEGER NOT NULL,
    "username" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Post" (
    "postID" INTEGER NOT NULL,
    "payload" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("postID")
);
