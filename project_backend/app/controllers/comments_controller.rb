class CommentsController < ApplicationController
    def index
        comments = Comment.all 
        render json: comments
    end

    def show
        comment = Comment.find_by(id: params[:id])
        render json: comment
    end



    def create
        new_comment = Comment.create(content: params[:content], username: params[:user_name], state_id: params[:state_id])
        render( {json: new_comment})
    end
end
