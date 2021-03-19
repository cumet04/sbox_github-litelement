require "sinatra"
require "octokit"
require "./service"

if development?
  require "pry"
  require "sinatra/reloader"
end

service = Service.new(ENV.fetch("ACCESS_TOKEN"))

# TODO:
# - image
# - pr review

before do
  content_type :json
end

# The app don't distinguish issue/pullreq

get "/api/:owner/:repo/:number" do
  owner, repo, number = params[:owner], params[:repo], params[:number]
  out = service.get_issue(owner, repo, number)
  status 404 and return unless out
  out
end

get "/api/:owner/:repo/:number/comments" do
  owner, repo, number = params[:owner], params[:repo], params[:number]
  out = service.get_comments(owner, repo, number)
  status 404 and return unless out
  out
end
