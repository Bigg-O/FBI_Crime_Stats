class StatesController < ApplicationController

    def index 
        state = State.all 
        render json: state, except: [:created_at, :updated_at]
    end

end
