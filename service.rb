require "stringio"

class Service
  attr_reader :client

  def initialize(token)
    @client = Octokit::Client.new(
      access_token: token,
      default_media_type: "application/vnd.github.v3.html+json",
    )
  end

  def get_issue(owner, repo, number, force: false)
    filepath = issue_path(owner, repo, number)

    t = Thread.new do
      resp = client.issue("#{owner}/#{repo}", number)
      resp.to_h.to_json.then do |json|
        write_file(filepath, json)
        StringIO.new(json)
      end
    rescue Octokit::NotFound
      nil
    end
    !force && File.exist?(filepath) && File.open(filepath) || t.join.value
  end

  def get_comments(owner, repo, number, force: false)
    filepath = issue_path(owner, repo, number) + ".comments"

    t = Thread.new do
      # MEMO: need paginate?
      resp = client.issue_comments("#{owner}/#{repo}", number)
      resp.map(&:to_h).to_json.then do |json|
        write_file(filepath, json)
        StringIO.new(json)
      end
    rescue Octokit::NotFound
      nil
    end
    !force && File.exist?(filepath) && File.open(filepath) || t.join.value
  end

  private

  def issue_path(owner, repo, number)
    File.join(root_path, "#{owner}/#{repo}/#{number}")
  end

  def write_file(path, data)
    FileUtils.mkdir_p(File.dirname(path))
    File.write(path, data)
  end

  def root_path
    "/tmp/github_reader"
  end
end
