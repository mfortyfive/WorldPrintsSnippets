USE [WorldPrints]
GO
/****** Object:  StoredProcedure [dbo].[Users_Insert_V2]    Script Date: 11/30/2021 10:21:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER PROC [dbo].[Users_Insert_V2]
		 @Email nvarchar(100)
		,@Password varchar(100)
		,@RoleId int
		,@Id int OUTPUT

/* TEST CODE

DECLARE  @Email nvarchar(100) = 'test150@email.com'
		,@Password varchar(100) = 'pWord2021!'
		,@RoleId int = 1
		,@Id int 

EXECUTE dbo.Users_Insert_V2
		 @Email
		,@Password
		,@RoleId
		,@Id OUTPUT

EXECUTE dbo.Users_Select_ById
		@Id

*/

AS

BEGIN

	IF NOT EXISTS (SELECT 1
			FROM dbo.Users 
			WHERE Email = @Email)
		BEGIN
			INSERT INTO  dbo.Users
						([Email]
						,[Password]
						,[RoleId])
			VALUES		(@Email
						,@Password
						,@RoleId)
	
			SET @Id = SCOPE_IDENTITY()
		END

	ELSE
		BEGIN;
			THROW 50409, 'Email Already Exists', 1
		END

END

