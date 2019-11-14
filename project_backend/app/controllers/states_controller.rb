class StatesController < ApplicationController

    def index 
        states = State.all 
        render json: states
    end

    def show
        state = State.find_by(id: params[:id])
        render json: state, include: [:comments]
    end

end
