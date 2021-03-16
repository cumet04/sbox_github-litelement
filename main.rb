require "octokit"
require "./service"
require "pry"

service = Service.new(ENV.fetch("ACCESS_TOKEN"))

service.get_comments("rails", "rails", 41659, force: true)
# binding.pry
# puts 0
