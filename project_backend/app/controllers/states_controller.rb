class StatesController < ApplicationController

    def index 
        render json: State.all
    end

end
