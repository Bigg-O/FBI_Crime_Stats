class StatesController < ApplicationController

    def index
        states = States.ApplicationController
        render json: states
    end
end
